import { PageTitle } from '../components/PageTitle';

const AboutUs = () => {
  return (
    <>
      <PageTitle title="About Us" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Welcome to our platform! We are dedicated to providing the best experience for our users
            through innovative solutions and cutting-edge technology.
          </p>
          <p>
            Our mission is to empower users with tools that make their work more efficient and
            productive. We believe in continuous improvement and always strive to deliver the best
            possible service.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
